<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="2.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xs="http://www.w3.org/2001/XMLSchema"
	xmlns:fn="http://www.w3.org/2005/xpath-functions"
	xmlns:n="urn:com-cerner-patient-ehr:v3"
	xmlns:cdocfx="urn:com-cerner-physician-documentation-functions"
	xmlns:dd="DynamicDocumentation"
	xmlns:java-string="java:java.lang.String"
	xmlns:xr-date-formatter="java:com.cerner.xsl.util.XSLTDateUtilities"
	xmlns:doc="java:com.cerner.documentation.extension.XSLTFuncs"
	exclude-result-prefixes="xsl xs fn n cdocfx java-string xr-date-formatter doc">

	<xsl:param as="xs:string" name="current-locale" select="'en_US'"/>

	<!-- Required to include CommonFxn.xslt -->
	<!-- Comment this line to debug --><xsl:include href="/cernerbasiccontent/formats/commonfxn.xslt"/> 
	<!-- Uncomment this line to debug <xsl:include href="../commonfxn.xslt" /> -->

	<!-- This will be over-written during Run-Time -->
	<xsl:variable name="bIsUTCOn" as="xs:boolean" select="true()"/>

	<!-- Default string constants -->
	<xsl:variable name="DATE_SEQUENCE_UTC_ON" as="xs:string" select="'MM/dd/yyyy HH:mm zzz'"/>
	<xsl:variable name="DATE_SEQUENCE_UTC_OFF" as="xs:string" select="'MM/dd/yyyy HH:mm'"/>
	<xsl:variable name="LabUnit" as="xs:string" select="'(%s)'"/>

	<!-- This is a derived variable and doesn't need to go in the i18n string tables -->
	<xsl:variable name="DATE_SEQUENCE" as="xs:string" select="cdocfx:getDateDisplayPattern($bIsUTCOn, $DATE_SEQUENCE_UTC_ON, $DATE_SEQUENCE_UTC_OFF)"/>

	<xsl:template match="/">
		<xsl:variable name="Tags" select="n:report/n:tags"/>
		<xsl:for-each select="n:report/n:clinical-data/n:lab-measurement-data/n:lab-order/n:specimen-collection/n:measurement">
			<xsl:sort select="doc:getSequence(n:event-type/@event-code-id)" data-type="number" order="ascending" />
			<xsl:sort select="doc:getTimeInMillisecs(n:event-end-dt-tm)" data-type="number" order="descending" />

			<xsl:variable name="EventStatusMean" as="xs:string" select="cdocfx:getCodeMeanByID(@event-status-code)" />

			<xsl:choose>
				<xsl:when test="$EventStatusMean != 'INERROR' and $EventStatusMean != 'IN ERROR'
							and $EventStatusMean != 'INERRNOMUT' and $EventStatusMean != 'INERRNOVIEW'">
					<xsl:variable name="EventId" select="@event-id"/>

					<xsl:variable name="RecordDtTm">
						<xsl:for-each select="$Tags/n:tag">
							<xsl:if test="@event-id = $EventId">
								<xsl:value-of select="n:tag-dt-tm"/>
							</xsl:if>
						</xsl:for-each>
					</xsl:variable>

					<xsl:variable name="UserTz">
						<xsl:value-of select="$Tags/n:user-time-zone"/>
					</xsl:variable>

					<xsl:call-template name="measurement">
						<xsl:with-param name="display" select="n:event-type/@event-display"/>
						<xsl:with-param name="value" select="n:value"/>
						<xsl:with-param name="tagdttm" select="$RecordDtTm"/>
						<xsl:with-param name="usertz" select="$UserTz"/>
					</xsl:call-template>
				</xsl:when>
			</xsl:choose>
		</xsl:for-each>
	</xsl:template>

	<xsl:template name="measurement">
	<xsl:param name="display" as="xs:string"/>
	<xsl:param name="value"/>
	<xsl:param name="tagdttm"/>
	<xsl:param name="usertz" as="xs:string"/>

		<div class="ddemrcontentitem">
			<xsl:attribute name="style">
				<xsl:value-of select="'padding:6px;height:45px;border-top:solid 1px #dddddd;'"/>
			</xsl:attribute>
			<xsl:attribute name="dd:entityid">
				<xsl:value-of select="@event-id"/>
			</xsl:attribute>
			<xsl:attribute name="dd:contenttype">
				<!-- We need to use xsl:value-of here instead of xsl:text like most other formats use because otherwise we cannot drag and drop into the editor.  
				Using xsl:text causes the content of the attribute to be pretty-printed such that there is a new line and spacing before and after the actual 
				text which causes the JavaScript to not match on the element correctly. -->
				<xsl:value-of select="'LABS_V2'"/>
			</xsl:attribute>

			<!-- Show the lab display -->
			<span class="ddemrcontenttext">
				<xsl:attribute name="style">
					<xsl:value-of select="'font-size:12px;color:#505050;max-width:40%;float:left;overflow:hidden;text-overflow:ellipsis;'"/>
				</xsl:attribute>
				<xsl:attribute name="title">
					<xsl:value-of select="$display"/>
				</xsl:attribute>
				<xsl:value-of select="$display"/>
			</span>

			<!-- Check if the lab has been changed (will we show the delta indicator?) -->
			<xsl:variable name="IsChanged" as="xs:string">
				<xsl:choose>
					<xsl:when test="n:updt-dt-tm">
						<xsl:variable name="UpdtDtTm" as="xs:dateTime" select="n:updt-dt-tm"/>
						<xsl:choose>
							<xsl:when test="xs:dateTime($UpdtDtTm) gt xs:dateTime($tagdttm)">
								<xsl:value-of select="'true'"/>
							</xsl:when>
							<xsl:otherwise>
								<xsl:value-of select="'false'"/>
							</xsl:otherwise>
						</xsl:choose>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of select="'false'"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:variable>

			<!-- Show the delta indicator if needed -->
			<xsl:choose>
				<xsl:when test="$IsChanged = 'true'">
					<span class="ddchanged">
						<xsl:attribute name="style">
							<xsl:value-of select="'background-position:left;background-repeat:no-repeat;margin-right:24px;margin-top:10px;font-size:18px;float:right;width:12px;height:15.5px;'"/>
						</xsl:attribute>
						<xsl:text disable-output-escaping="yes"> <![CDATA[&#160;]]><![CDATA[&#160;]]></xsl:text>
					</span>
				</xsl:when>
			</xsl:choose>

			<!-- Show the result with the correct normalcy -->
			<span>
				<!-- RGB color constants -->
				<xsl:variable name="ColorNormalText" as="xs:string" select="'505050'"/>
				<xsl:variable name="ColorCritical" as="xs:string" select="'CC0000'"/>
				<xsl:variable name="ColorAbnormal" as="xs:string" select="'976823'"/>
				<xsl:variable name="ColorHigh" as="xs:string" select="'FF7F12'"/>
				<xsl:variable name="ColorLow" as="xs:string" select="'0053E6'"/>

				<xsl:variable name="ResultStyle" as="xs:string" select="'color:#%s; background-position:left;background-repeat:no-repeat;padding-left:18px;font-size:18px;float:right;overflow:hidden;text-overflow:ellipsis;max-width:25%%;'"/>

				<!-- If we are showing the delta indicator, we do not want a right margin on the result
					 so that they appear right next to each other. If not showing the delta, we need
					 to include the margin so that we leave room for the remove button -->
				<xsl:variable name="ResultRightMargin" as="xs:string">
					<xsl:choose>
						<xsl:when test="$IsChanged = 'true'">
							<xsl:value-of select="''"/>
						</xsl:when>
						<xsl:otherwise>
							<xsl:value-of select="'margin-right:24px;'"/>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:variable>

				<!-- Get the normalcy and set the class and style attributes -->
				<xsl:choose>
					<xsl:when test="@interpretation-code">
						<xsl:variable name="NormalcyMean" as="xs:string" select="cdocfx:getCodeMeanByID(@interpretation-code)"/>
						<xsl:choose>
							<xsl:when test="($NormalcyMean = 'CRITICAL') or ($NormalcyMean = 'EXTREMEHIGH')
								or ($NormalcyMean = 'PANICHIGH') or ($NormalcyMean = 'EXTREMELOW') or ($NormalcyMean = 'PANICLOW')
								or ($NormalcyMean = 'VABNORMAL') or ($NormalcyMean = 'POSITIVE')">
								<xsl:attribute name="class">
									<xsl:value-of select="'ddcritical'"/>
								</xsl:attribute>
								<xsl:attribute name="style">
									<xsl:value-of select="$ResultRightMargin"/>
									<xsl:value-of select="java-string:format($ResultStyle, $ColorCritical)"/>
								</xsl:attribute>
							</xsl:when>
							<xsl:when test="($NormalcyMean = 'ABNORMAL')">
								<xsl:attribute name="class">
									<xsl:value-of select="'ddabnormal'"/>
								</xsl:attribute>
								<xsl:attribute name="style">
									<xsl:value-of select="$ResultRightMargin"/>
									<xsl:value-of select="java-string:format($ResultStyle, $ColorAbnormal)"/>
								</xsl:attribute>
							</xsl:when>
							<xsl:when test="($NormalcyMean = 'HIGH')">
								<xsl:attribute name="class">
									<xsl:value-of select="'ddnormhigh'"/>
								</xsl:attribute>
								<xsl:attribute name="style">
									<xsl:value-of select="$ResultRightMargin"/>
									<xsl:value-of select="java-string:format($ResultStyle, $ColorHigh)"/>
								</xsl:attribute>
							</xsl:when>
							<xsl:when test="($NormalcyMean = 'LOW')">
								<xsl:attribute name="class">
									<xsl:value-of select="'ddnormlow'"/>
								</xsl:attribute>
								<xsl:attribute name="style">
									<xsl:value-of select="$ResultRightMargin"/>
									<xsl:value-of select="java-string:format($ResultStyle, $ColorLow)"/>
								</xsl:attribute>
							</xsl:when>
							<xsl:otherwise>
								<xsl:attribute name="style">
									<xsl:value-of select="$ResultRightMargin"/>
									<xsl:value-of select="java-string:format($ResultStyle, $ColorNormalText)"/>
								</xsl:attribute>
							</xsl:otherwise>
						</xsl:choose>
					</xsl:when>
					<xsl:otherwise>
						<xsl:attribute name="style">
							<xsl:value-of select="$ResultRightMargin"/>
							<xsl:value-of select="java-string:format($ResultStyle, $ColorNormalText)"/>
						</xsl:attribute>
					</xsl:otherwise>
				</xsl:choose>

				<!-- Get the result value -->
				<xsl:variable name="ResultVal" as="xs:string" select="cdocfx:getMeasurementValueDisplay($value, $DATE_SEQUENCE)"/>

				<!-- Show the result -->
				<xsl:attribute name="title">
					<xsl:value-of select="$ResultVal"/>
				</xsl:attribute>
				<xsl:value-of select="$ResultVal"/>
			</span>

			<!-- Show the units -->
			<xsl:choose>
				<xsl:when test="$value/n:quantity/@unit-code">
					<span class="ddunits">
						<xsl:attribute name="style">
							<xsl:value-of select="'color:#9f9f9f;font-size:10px;float:left;max-width:20%;margin-left:4px;margin-right:4px;max-height:24px;overflow:hidden;text-overflow:ellipsis;'"/>
						</xsl:attribute>
						<xsl:variable name="TempLabUnit" as="xs:string">
							<xsl:value-of select="cdocfx:getCodeDisplayByID($value/n:quantity/@unit-code)"/>
						</xsl:variable>
						<xsl:attribute name="title">
							<xsl:value-of select="java-string:format($LabUnit, $TempLabUnit)"/>
						</xsl:attribute>
						<xsl:value-of select="java-string:format($LabUnit, $TempLabUnit)"/>
					</span>
				</xsl:when>
			</xsl:choose>

			<!-- Show the update date time -->
			<xsl:choose>
				<xsl:when test="n:event-end-dt-tm">
					<div class="ddupdtdttm">
						<xsl:attribute name="style">
							<xsl:value-of select="'color:#9f9f9f;font-size:10px;clear:both;text-align:right;margin-right:24px;overflow:hidden;text-overflow:ellipsis;margin-top:6px;'"/>
						</xsl:attribute>
						<xsl:variable name="EventEndDtTm" as="xs:dateTime" select="n:event-end-dt-tm"/>
						<xsl:attribute name="title">
							<xsl:value-of select="xr-date-formatter:formatDate($EventEndDtTm, $DATE_SEQUENCE, $usertz, $current-locale)"/>
						</xsl:attribute>
						<xsl:value-of select="xr-date-formatter:formatDate($EventEndDtTm, $DATE_SEQUENCE, $usertz, $current-locale)"/>
					</div>
				</xsl:when>
			</xsl:choose>

		</div>

	</xsl:template>

</xsl:stylesheet>
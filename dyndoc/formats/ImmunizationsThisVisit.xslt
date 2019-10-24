<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="7.0"?>
<xsl:stylesheet version="2.0" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xs="http://www.w3.org/2001/XMLSchema" 
	xmlns:fn="http://www.w3.org/2005/xpath-functions"
	xmlns:xr-date-formatter="java:com.cerner.xsl.util.XSLTDateUtilities"
	xmlns:n="urn:com-cerner-patient-ehr:v3"
	xmlns:cdocfx="urn:com-cerner-physician-documentation-functions"
	xmlns:extfx="urn:com-cerner-physician-documentation-extension-functions"
	xmlns:doc="java:com.cerner.documentation.extension.XSLTFuncs"
	xmlns:dd="DynamicDocumentation"
	xmlns:java-string="java:java.lang.String"
	exclude-result-prefixes="xsl xs fn xr-date-formatter n cdocfx extfx doc dd java-string">

	<!-- Common function and constants for the immunization format files. -->
	<!-- Comment this line to debug --> <xsl:import href="/cernerbasiccontent/formats/immunizationcommon.xslt" />
	<!-- Uncomment this line to debug <xsl:import href="immunizationcommon.xslt" /> -->
	
	<xsl:output method="html" encoding="UTF-8" indent="yes"/>
	<xsl:param as="xs:string" name="current-locale" select="'en_US'"/>
	
	<!-- Default to patient facing styles, provider facing will be defined in the i18n file -->
	<xsl:variable name="providerFacing" select="false()" as="xs:boolean"/>

	<xsl:template match="/">

		<xsl:variable name="DoCommentsExistGiven" as="xs:string">
			<xsl:choose>
				<xsl:when test="n:report/n:clinical-data/n:immunizationV2-data/n:given/n:comment">
					<xsl:value-of select="'1'"/>
				</xsl:when>
				<xsl:otherwise>
					<xsl:value-of select="'0'"/>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		
		<xsl:variable name="DoCommentsExistNotGiven" as="xs:string">
			<xsl:choose>
				<xsl:when test="n:report/n:clinical-data/n:immunizationV2-data/n:not-given/n:comment or n:report/n:clinical-data/n:immunizationV2-data/n:not-given/@reason-code"  >
					<xsl:value-of select="'1'"/>
				</xsl:when>
				<xsl:otherwise>
					<xsl:value-of select="'0'"/>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>

		<!-- Build XML containing given and not-given so that all of them can be looped through and sorted together -->
		<xsl:variable name="Immunizations">
			<xsl:if test="n:report/n:clinical-data/n:immunizationV2-data/n:given">
				<xsl:for-each select="n:report/n:clinical-data/n:immunizationV2-data/n:given">
					<xsl:if test="@is-uncharted='false'">
						<immunizationGiven status="given">
							<xsl:attribute name="event-id">
								<xsl:if test="@event-id">   
									<xsl:value-of select="@event-id"/>
								</xsl:if>   
							</xsl:attribute>
							<xsl:attribute name="event-display">
								<xsl:if test="n:vaccine/n:event-type/@event-display">   
									<xsl:value-of select="n:vaccine/n:event-type/@event-display"/>
								</xsl:if>   
							</xsl:attribute>
							<xsl:attribute name="dt-tm-to-sort">
								<xsl:if test="n:admin-dt-tm">   
									<xsl:value-of select="n:admin-dt-tm"/>
								</xsl:if>   
							</xsl:attribute>
							<xsl:attribute name="display-dt-tm">
								<xsl:if test="n:admin-dt-tm">   
									<xsl:variable name="ImmuDateTime" as="xs:dateTime" select="n:admin-dt-tm"/>
									<xsl:variable name="ImmuTimeZone" as="xs:string" select="n:admin-dt-tm/@time-zone"/>
									<xsl:value-of select="xr-date-formatter:formatDate($ImmuDateTime, $DATE_ONLY_SEQUENCE, $ImmuTimeZone, $current-locale)"/>
								</xsl:if>   
							</xsl:attribute>
							<xsl:for-each select="n:comment">
								<comment>
									<xsl:value-of select="n:comment"/>
								</comment>
							</xsl:for-each>
						</immunizationGiven>
					</xsl:if>
				</xsl:for-each>
			</xsl:if>

			<xsl:if test="n:report/n:clinical-data/n:immunizationV2-data/n:not-given">
				<xsl:for-each select="n:report/n:clinical-data/n:immunizationV2-data/n:not-given">
					<xsl:if test="@is-uncharted='false'">
						<immunizationNotGiven status="not-given">
							<xsl:attribute name="event-id">
								<xsl:if test="@event-id">
									<xsl:value-of select="@event-id"/>
								</xsl:if>
							</xsl:attribute>
							<xsl:attribute name="event-display">
								<xsl:if test="n:vaccine/n:event-type/@event-display">
									<xsl:value-of select="n:vaccine/n:event-type/@event-display"/>
								</xsl:if>
							</xsl:attribute>
							<xsl:attribute name="not-given-reason">
								<xsl:if test="@reason-code">
									<xsl:value-of select="cdocfx:getCodeDisplayByID(@reason-code)"/>
								</xsl:if>
							</xsl:attribute>

							<xsl:for-each select="n:comment">
								<comment>
									<xsl:value-of select="n:comment"/>
								</comment>
							</xsl:for-each>
						</immunizationNotGiven>
					</xsl:if>
				</xsl:for-each>
			</xsl:if>
		</xsl:variable>

		<xsl:if test="$Immunizations/immunizationGiven">
			<!-- $Immunizations is the XML built, combining given and not-given -->
			<div class="ddgrouper ddremovable" dd:btnfloatingstyle="top-right">
				<xsl:if test="$providerFacing">
					<xsl:attribute name="style" select="'margin-left: 1em;'"/>
				</xsl:if>
				<span>
					<xsl:attribute name="style" select="if($providerFacing) then 'text-decoration:underline;' else 'font-size:13pt;font-weight: bold;'"/>
					<xsl:value-of select="$Given"/>
				</span>
				<!-- Separate columns by a space in plain text conversion -->
				<table style="border-spacing:1.5em 0; border-collapse:collapse;border:1px solid #000; margin-left: 1em;" class="ddremovable" dd:btnfloatingstyle="top-right" dd:zebrastripecolor="#F4F4F4" dd:zebraheadercolor="#F4F4F4" dd:whitespacecolseparator="true">
					<thead style="display:table-header-group;"> <!-- This thead will repeat table heading on each page when printing on paper such as Draft Print -->
						<tr>
							<th>
								<xsl:attribute name="style" select="if($providerFacing) then 'font-weight:normal; text-align:center; vertical-align:top; padding:0 5px; padding-left:6px; border-bottom: 1px solid #000;'
									else 'font-weight:bold; text-align:center; vertical-align:top; padding:0 5px; padding-left:6px; border-bottom: 1px solid #000;'"/>
								<xsl:value-of select="$Vaccine"/>
							</th>
							<th> 
								<xsl:attribute name="style" select="if($providerFacing) then 'font-weight:normal; text-align:center; vertical-align:top; padding:0 5px; border-bottom: 1px solid #000; border-left:1px solid #000; padding-left:6px;'
									else 'font-weight:bold; text-align:center; vertical-align:top; padding:0 5px; border-bottom: 1px solid #000; border-left:1px solid #000; padding-left:6px;'"/>
								<xsl:value-of select="$Date"/>
							</th>
	
							<xsl:if test="$DoCommentsExistGiven='1'">
								<th>
									<xsl:attribute name="style" select="if($providerFacing) then 'font-weight:normal; text-align:center; vertical-align:top; padding:0 5px; border-bottom: 1px solid #000; border-left:1px solid #000; padding-left:6px;'
										else 'font-weight:bold; text-align:center; vertical-align:top; padding:0 5px; border-bottom: 1px solid #000; border-left:1px solid #000; padding-left:6px;'"/>
									<xsl:value-of select="$Comment"/>
								</th>
							</xsl:if>
						</tr>
					</thead>
					<tbody>
						<xsl:for-each select="$Immunizations/immunizationGiven">
							<xsl:sort select="@dt-tm-to-sort" order="descending"/>
							
							<xsl:call-template name="DisplayGivenImmunization">
								<xsl:with-param name="Immunization" select="."/>
								<xsl:with-param name="ShowCommentsColumn" select="$DoCommentsExistGiven"/>
							</xsl:call-template>
						</xsl:for-each>
					</tbody>
				</table>
			</div>
		</xsl:if>

		<xsl:if test="$Immunizations/immunizationNotGiven">
			<xsl:if test="$Immunizations/immunizationGiven">
				<br/>
			</xsl:if>
			<!-- $Immunizations is the XML built, combining given and not-given immunizations -->
			<div class="ddgrouper ddremovable" dd:btnfloatingstyle="top-right">
				<xsl:if test="$providerFacing">
					<xsl:attribute name="style" select="'margin-left: 1em;'"/>
				</xsl:if>
				<span>
					<xsl:attribute name="style" select="if($providerFacing)then 'text-decoration:underline;' else 'font-size:13pt;font-weight: bold;'"/>
					<xsl:value-of select="$NotGiven"/>
				</span>
				<!-- Separate columns by a space in plain text conversion -->
				<table style="border-spacing:1.5em 0; border-collapse:collapse;border:1px solid #000; margin-left: 1em;width = 100%" class="ddremovable" dd:btnfloatingstyle="top-right" dd:zebrastripecolor="#F4F4F4" dd:zebraheadercolor="#F4F4F4" dd:whitespacecolseparator="true">
					<thead style="display:table-header-group;"> <!-- This thead will repeat table heading on each page when printing on paper such as Draft Print -->
						<tr>
							<th>
								<xsl:attribute name="style" select="if($providerFacing) then 'font-weight:normal; text-align:center; vertical-align:top; padding:0 5px; padding-left:6px; border-bottom: 1px solid #000;'
									else 'font-weight:bold; text-align:center; vertical-align:top; padding:0 5px; padding-left:6px; border-bottom: 1px solid #000;'"/>
								<xsl:value-of select="$Vaccine"/>
							</th>
							<xsl:if test="$DoCommentsExistNotGiven='1'">
								<th>
									<xsl:attribute name="style" select="if($providerFacing) then 'font-weight:normal; text-align:center; vertical-align:top; padding:0 5px; border-bottom: 1px solid #000; border-left:1px solid #000; padding-left:6px;'
										else 'font-weight:bold; text-align:center; vertical-align:top; padding:0 5px; border-bottom: 1px solid #000; border-left:1px solid #000; padding-left:6px;'"/>
									<xsl:value-of select="$Comment"/>
								</th>
							</xsl:if>
						</tr>
					</thead>

					<xsl:for-each select="$Immunizations/immunizationNotGiven">
						<xsl:sort select="@dt-tm-to-sort" order="descending"/>
						
						<xsl:call-template name="DisplayNotGivenImmunization">
							<xsl:with-param name="Immunization" select="."/>
							<xsl:with-param name="ShowCommentsColumn" select="$DoCommentsExistNotGiven"/>
						</xsl:call-template>
					</xsl:for-each>
				</table>
			</div>
		</xsl:if>
	</xsl:template>

	<xsl:template name="DisplayGivenImmunization">
		<xsl:param name = "Immunization"/>
		<xsl:param name = "ShowCommentsColumn"/>

		<tr class="ddemrcontentitem ddremovable" dd:btnfloatingstyle="top-right">
			<xsl:attribute name="dd:entityid">
				<xsl:if test="$Immunization/@event-id"> 
					<xsl:value-of select="$Immunization/@event-id"/>
				</xsl:if>   
			</xsl:attribute>
			<xsl:attribute name="dd:contenttype">
				<xsl:text>IMMUNZTNS_V2</xsl:text>
			</xsl:attribute>

			<td style="border-top:1px solid #000; padding-left:6px; vertical-align:top; padding:0 5px;">
				<xsl:if test="$Immunization/@event-display">
					<xsl:value-of select="$Immunization/@event-display"/>
				</xsl:if>
			</td>

			<td style="border-top:1px solid #000;border-left:1px solid #000; padding-left:6px; vertical-align:top; padding:0 5px;">
				<xsl:if test="$Immunization/@display-dt-tm">
					<xsl:value-of select="$Immunization/@display-dt-tm"/>
				</xsl:if>
			</td>

			<xsl:if test="$ShowCommentsColumn='1'">
				<td style="border-top:1px solid #000;border-left:1px solid #000; padding-left:6px; vertical-align:top; padding:0 5px;">
					<xsl:if test="$Immunization/comment">
						<xsl:for-each select="$Immunization/comment">
							<xsl:variable name="Comment" as="xs:string">
								<xsl:value-of select="."/>
							</xsl:variable>
							<xsl:value-of disable-output-escaping="yes" select="doc:convertPlainTextToHtml($Comment)"/>
							<xsl:if test="position()!=last()">
								<br />  
							</xsl:if>
						</xsl:for-each>
					</xsl:if>
				</td>
			</xsl:if>
		</tr>
	</xsl:template>

	<xsl:template name="DisplayNotGivenImmunization">
		<xsl:param name = "Immunization"/>
		<xsl:param name = "ShowCommentsColumn"/>

		<tr class="ddemrcontentitem ddremovable" dd:btnfloatingstyle="top-right">
			<xsl:attribute name="dd:entityid">
				<xsl:if test="$Immunization/@event-id"> 
					<xsl:value-of select="$Immunization/@event-id"/>
				</xsl:if>   
			</xsl:attribute>
			<xsl:attribute name="dd:contenttype">
				<xsl:text>IMMUNZTNS_V2</xsl:text>
			</xsl:attribute>

			<td style="border-top:1px solid #000; padding-left:6px; vertical-align:top; padding:0 5px;">
				<xsl:if test="$Immunization/@event-display">
					<xsl:value-of select="$Immunization/@event-display"/>
				</xsl:if>
			</td>

			<xsl:if test="$ShowCommentsColumn='1'">
				<td style="border-top:1px solid #000;border-left:1px solid #000; padding-left:6px; vertical-align:top; padding:0 5px;">
					<xsl:if test="$Immunization/@not-given-reason">
						<div><xsl:value-of select="$Immunization/@not-given-reason"/></div>
					</xsl:if>
					<xsl:if test="$Immunization/comment">
						<xsl:for-each select="$Immunization/comment">
							<xsl:variable name="Comment" as="xs:string">
								<xsl:value-of select="."/>
							</xsl:variable>
							<xsl:value-of disable-output-escaping="yes" select="doc:convertPlainTextToHtml($Comment)"/>
							<xsl:if test="position()!=last()">
								<br />  
							</xsl:if>
						</xsl:for-each>
					</xsl:if>
				</td>
			</xsl:if>
		</tr>
	</xsl:template>

</xsl:stylesheet>

<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="1.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:fn="http://www.w3.org/2005/xpath-functions"
    xmlns:cdocfx="urn:com-cerner-physician-documentation-functions"
    xmlns:n="urn:com-cerner-patient-ehr:v3"
    xmlns:dd="DynamicDocumentation"
    exclude-result-prefixes="xsl xs fn cdocfx n dd">

    <!-- Comment this line to debug--> <xsl:include href="/cernerbasiccontent/formats/commonfxn.xslt" />
    <!--Uncomment this line to debug <xsl:include href="commonfxn.xslt" />-->

    <!-- Comment this line to debug--> <xsl:include href="/cernerbasiccontent/formats/problemcommon.xslt" />
    <!--Uncomment this line to debug <xsl:include href="problemcommon.xslt" />-->

    <!-- Comment this line to debug--> <xsl:include href="/cernerbasiccontent/formats/tablecommon.xslt" />
    <!--Uncomment this line to debug <xsl:include href="tablecommon.xslt" />-->

    <!-- Comment this line to debug--> <xsl:include href="/cernerbasiccontent/formats/emrinfocommon.xslt" />
    <!--Uncomment this line to debug <xsl:include href="emrinfocommon.xslt" />-->

    <xsl:variable name="conditionHeading" as="xs:string" select="'Condition'"/>
    <xsl:variable name="onsetDateHeading" as="xs:string" select="'Onset Date'"/>
    <xsl:variable name="statusHeading" as="xs:string" select="'Status'"/>
    <xsl:variable name="sourceHeading" as="xs:string" select="'Source'"/>
    <xsl:variable name="commentHeading" as="xs:string" select="'Comments'"/>

    <xsl:variable name="DATE_ONLY_SEQUENCE" as="xs:string" select="'MM/dd/yyyy'"/>

    <xsl:template match="/">
        <xsl:if test="n:report/n:clinical-data/n:problem-data/n:problem">

            <xsl:call-template name="emitTableStart">
                <xsl:with-param name="retainRowsInPlainText" select="true()"/>
            </xsl:call-template>

            <xsl:call-template name="emitHeadingStart">
                <xsl:with-param name="repeatHeadingOnPrintedPages" select="true()"/>
            </xsl:call-template>

            <xsl:call-template name="emitSingleHeader"><xsl:with-param name="colName" select="$conditionHeading"/></xsl:call-template>
            <xsl:call-template name="emitSingleHeader"><xsl:with-param name="colName" select="$onsetDateHeading"/></xsl:call-template>
            <xsl:call-template name="emitSingleHeader"><xsl:with-param name="colName" select="$statusHeading"/></xsl:call-template>
            <xsl:call-template name="emitSingleHeader"><xsl:with-param name="colName" select="$sourceHeading"/></xsl:call-template>
            <xsl:call-template name="emitSingleHeader"><xsl:with-param name="colName" select="$commentHeading"/></xsl:call-template>

            <xsl:call-template name="emitHeadingEnd"/>

            <tbody>
                <xsl:call-template name="emitProblemsRows"/>
            </tbody>

            <xsl:call-template name="emitTableEnd"/>
            <xsl:value-of disable-output-escaping="yes" select="$newLine"/>

        </xsl:if>
    </xsl:template>

    <xsl:template name="emitProblemsRows">

        <xsl:for-each select="n:report/n:clinical-data/n:problem-data/n:problem">

            <xsl:sort select="cdocfx:getCodeDisplayByID(@life-cycle-status-code)"/>
            <xsl:sort select="@annotated-display"/>

            <tr class="ddemrcontentitem ddremovable" style="page-break-inside: avoid;" dd:btnfloatingstyle="top-right">
                <xsl:if test="@id">
                    <xsl:attribute name="dd:entityid">
                        <xsl:value-of select="@id"/>
                    </xsl:attribute>
                </xsl:if>
                <xsl:attribute name="dd:contenttype">
                    <xsl:text>PROBLEMS</xsl:text>
                </xsl:attribute>

                <!--Emit condition/display-->
                <xsl:call-template name="emitTableCellStart"/>
                <xsl:call-template name="emitEmrInfo">
                    <xsl:with-param name="InfoType" select="'PRB_DISP_RENDER'"/>
                    <xsl:with-param name="Content" select="cdocfx:getProblemDisplay(current())"/>
                </xsl:call-template>
                <xsl:call-template name="emitTableCellEnd"/>

                <!--Emit onset date-->
                <xsl:call-template name="emitTableCellStart"/>
                <xsl:if test="n:onset-date/n:date">
                    <xsl:value-of select="cdocfx:getFormattedDateTime(n:onset-date/n:date, $DATE_ONLY_SEQUENCE)"/>
                </xsl:if>
                <xsl:call-template name="emitTableCellEnd"/>

                <!--Emit status-->
                <xsl:call-template name="emitTableCellStart"/>
                <xsl:if test="@life-cycle-status-code">
                    <xsl:call-template name="emitEmrInfo">
                        <xsl:with-param name="InfoType" select="'PRB_LCSTATUS'"/>
                        <xsl:with-param name="Content" select="cdocfx:getCodeDisplayByID(@life-cycle-status-code)"/>
                    </xsl:call-template>
                </xsl:if>
                <xsl:call-template name="emitTableCellEnd"/>

                <!--Emit source-->
                <xsl:call-template name="emitTableCellStart"/>
                <xsl:if test="@classification-code">
                    <xsl:value-of select="cdocfx:getCodeDisplayByID(@classification-code)"/>
                </xsl:if>
                <xsl:call-template name="emitTableCellEnd"/>

                <!--Emit comments-->
                <xsl:call-template name="emitTableCellStart"/>
                <xsl:if test="n:problem-comment or n:problem-comment/n:comment != ''">
                    <xsl:call-template name="emitPRBComments">
                        <xsl:with-param name="Comments" select="n:problem-comment"/>
                    </xsl:call-template>
                </xsl:if>
                <xsl:call-template name="emitTableCellEnd"/>
            </tr>
        </xsl:for-each>
    </xsl:template>

    <!-- Get comments of the given problem wrapped in span tags with problem entityId and an InfoType as attributes. -->
    <!-- Parameters: -->
    <!-- Comments - problem comments-->
    <xsl:template name="emitPRBComments">
        <xsl:param name="Comments"/>

        <xsl:if test="count($Comments) = 1">
            <xsl:call-template name="emitEmrInfoWithEntityId">
                <xsl:with-param name="EntityId" select="$Comments/@comment-id"/>
                <xsl:with-param name="InfoType" select="'PRB_COMMENT'"/>
                <xsl:with-param name="Content" select="$Comments/n:comment"/>
            </xsl:call-template>
        </xsl:if>
        <xsl:if test="count($Comments) &gt; 1">
            <ul style="list-style-type: disc; margin: 0; padding-left: 1em;">
                <xsl:for-each select="$Comments">
                    <li dd:btnfloatingstyle="top-right" >
                        <xsl:call-template name="emitEmrInfoWithEntityId">
                            <xsl:with-param name="EntityId" select="@comment-id"/>
                            <xsl:with-param name="InfoType" select="'PRB_COMMENT'"/>
                            <xsl:with-param name="Content" select="n:comment"/>
                        </xsl:call-template>
                    </li>
                </xsl:for-each>
            </ul>
        </xsl:if>
    </xsl:template>

</xsl:stylesheet>